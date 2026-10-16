// @vitest-environment happy-dom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../lib/personal.js', () => ({ PERSONAL: true }))
vi.mock('../lib/api.js', () => ({ api: vi.fn() }))
vi.mock('./useUI.js', () => ({ useUI: { getState: () => ({ toast: vi.fn() }) } }))

beforeEach(() => {
  vi.resetModules()
  vi.clearAllMocks()
  localStorage.clear()
})

afterEach(() => localStorage.clear())

describe('personal GitHub Pages build', () => {
  it('starts empty without a server, example history or a demo coach', async () => {
    const { useStore } = await import('./useStore.js')
    const { api } = await import('../lib/api.js')
    const { coachAvailable } = await import('../lib/coach.js')

    await useStore.getState().boot()

    expect(useStore.getState().ready).toBe(true)
    expect(useStore.getState().isGuest()).toBe(true)
    expect(useStore.getState().S.workouts).toEqual([])
    expect(useStore.getState().S.routines).toEqual([])
    expect(useStore.getState().S.bodyweight).toEqual([])
    expect(localStorage.getItem('gym_demo_seeded_v1')).toBeNull()
    expect(api).not.toHaveBeenCalled()
    expect(coachAvailable(null, null, { demo: true })).toBe(false)
  })

  it('keeps saved workouts and plans on the first boot and later boots', async () => {
    const saved = {
      workouts: [{ id: 'my-workout', d: '2026-10-16', entries: [] }],
      routines: [{ id: 'my-plan', name: 'My training', ex: [] }],
      bodyweight: [{ d: '2026-10-16', v: 70 }], week: { 1: ['my-plan'] },
    }
    localStorage.setItem('gym_state_v1', JSON.stringify(saved))
    const { useStore } = await import('./useStore.js')

    await useStore.getState().boot()
    await useStore.getState().boot()

    expect(useStore.getState().S.workouts).toEqual(saved.workouts)
    expect(useStore.getState().S.routines).toEqual(saved.routines)
    expect(useStore.getState().S.bodyweight).toEqual(saved.bodyweight)
    expect(useStore.getState().S.week).toEqual(saved.week)
    expect(JSON.parse(localStorage.getItem('gym_state_v1'))).toEqual(saved)
  })

  it('persists edits and restores an exported JSON backup without contacting a server', async () => {
    const { useStore } = await import('./useStore.js')
    const { api } = await import('../lib/api.js')
    await useStore.getState().boot()
    useStore.getState().update(s => {
      s.routines.push({ id: 'saved-plan', name: 'My plan', ex: [] })
      s.bodyweight.push({ d: '2026-10-16', v: 70 })
    })
    const backup = JSON.parse(localStorage.getItem('gym_state_v1'))

    useStore.getState().update(s => { s.routines = []; s.bodyweight = [] })
    useStore.getState().importBackup(backup)

    expect(useStore.getState().S.routines).toEqual(backup.routines)
    expect(useStore.getState().S.bodyweight).toEqual(backup.bodyweight)
    expect(JSON.parse(localStorage.getItem('gym_state_v1')).routines).toEqual(backup.routines)
    expect(api).not.toHaveBeenCalled()
  })

  it('cannot replace personal history with sample data through the demo reset', async () => {
    const { useStore } = await import('./useStore.js')
    await useStore.getState().boot()
    useStore.getState().update(s => { s.workouts.push({ id: 'keep', d: '2026-10-16', entries: [] }) })
    const saved = localStorage.getItem('gym_state_v1')

    await useStore.getState().resetDemo()

    expect(localStorage.getItem('gym_state_v1')).toBe(saved)
    expect(useStore.getState().S.workouts[0].id).toBe('keep')
  })
})

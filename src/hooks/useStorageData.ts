import { useCallback, useEffect, useState } from 'react'
import type { Incidencia, Persona } from '../types'
import { getIncidencias, getPersonas } from '../lib/storage'
import { subscribeStorageSync } from '../lib/storageSync'

export function usePersonas(refreshKey = 0) {
  const [personas, setPersonas] = useState<Persona[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const reload = useCallback(() => {
    setLoading(true)
    setError('')
    getPersonas()
      .then(setPersonas)
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar personas'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    getPersonas()
      .then((data) => {
        if (!cancelled) setPersonas(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error al cargar personas')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [refreshKey, reload])

  useEffect(() => subscribeStorageSync('personas', reload), [reload])

  return { personas, loading, error, reload }
}

export function useIncidencias(refreshKey = 0) {
  const [incidencias, setIncidencias] = useState<Incidencia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const reload = useCallback(() => {
    setLoading(true)
    setError('')
    getIncidencias()
      .then(setIncidencias)
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar incidencias'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    getIncidencias()
      .then((data) => {
        if (!cancelled) setIncidencias(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error al cargar incidencias')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [refreshKey, reload])

  useEffect(() => subscribeStorageSync('incidencias', reload), [reload])

  return { incidencias, loading, error, reload }
}

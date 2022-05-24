import { useCallback, useEffect, useMemo, useState } from 'react'

function useIsMounted() {
    const [isMounted, setIsMounted] = useState(true)
    useEffect(
        () => () => {
            setIsMounted(false)
        },
        []
    )
    return isMounted
}

export function useWindowHistory() {
    const isMounted = useIsMounted()
    const [location, setLocation] = useState<Location | void>(isMounted ? window.location : undefined)

    const setWindowLocation = useCallback(() => {
        setLocation(window.location)
    }, [])

    useEffect(() => {
        if (!isMounted) return
        if (!location) {
            setWindowLocation()
        }
        window.addEventListener('popstate', setWindowLocation)
        return () => {
            window.removeEventListener('popstate', setWindowLocation)
        }
    }, [isMounted, location, setWindowLocation])

    const push = useCallback(
        (url?: string | URL | null) => {
            window.history.replaceState(null, '', url)
            setWindowLocation()
        },
        [setWindowLocation]
    )

    const update = useCallback(
        (url?: string | URL | null) => {
            window.history.replaceState(null, '', url)
            setWindowLocation()
        },
        [setWindowLocation]
    )

    return { location, push, update }
}

export function useSearchParams(): [URLSearchParams, (setSearchParams: URLSearchParams) => void] {
    const history = useWindowHistory()
    const searchParams = useMemo<URLSearchParams>(() => new URLSearchParams(history.location?.search ?? '/'), [history.location?.search])
    const setSearchParams = useCallback(
        (searchParams: URLSearchParams) => {
            const newSearch = searchParams.toString()
            if (newSearch) history.update('?' + newSearch)
            else history.update('/')
        },
        [history]
    )
    return [searchParams, setSearchParams]
}
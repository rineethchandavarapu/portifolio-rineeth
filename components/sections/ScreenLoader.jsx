'use client'

import { useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import profile from '@/data/profile.json'
import styles from '@/styles/sections/ScreenLoader.module.css'

/** Must match startBtnFill / startBtnText duration in CSS */
const FILL_MS = 650
export default function ScreenLoader({ onDismiss }) {
  const hasStartedRef = useRef(false)
  const onDismissRef = useRef(onDismiss)

  useEffect(() => {
    onDismissRef.current = onDismiss
  }, [onDismiss])

  const handleStart = useCallback(() => {
    if (hasStartedRef.current) return
    hasStartedRef.current = true

    // Start the video and remove the loader on the same frame the fill completes.
    window.dispatchEvent(new CustomEvent('loader-dismissed'))
    onDismissRef.current()
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(handleStart, FILL_MS)
    return () => window.clearTimeout(timer)
  }, [handleStart])

  return (
    <>
      <div className={styles.overlay}>
        <div className={styles.liquidBg} aria-hidden />

        <div className={styles.introCard}>
          <p className={styles.eyebrow}>{profile.introLoader.eyebrow}</p>
          <Image
            className={styles.logo}
            src="/favicons/icon-removebg-preview.png"
            alt="Rineeth logo"
            width={64}
            height={64}
            fetchPriority="high"
          />
          <h1 className={styles.name}>
            <span>{profile.name.first}</span>
            <span>{profile.name.last}</span>
          </h1>
          <p className={styles.tagline}>{profile.introLoader.message}</p>

          <button
            className={styles.startBtn}
            type="button"
            aria-label="Start portfolio"
            onClick={handleStart}
            onAnimationEnd={handleStart}
          >
            <span className={styles.startLabel}>Start</span>
          </button>
        </div>
      </div>

    </>
  )
}

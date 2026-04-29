<template>
  <div class="hex-star">
    <svg viewBox="0 0 200 200">
      <defs>
        <linearGradient id="gradPurple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="rgba(191,163,255,1)" />
          <stop offset="100%" stop-color="rgba(191,163,255,0.3)" />
        </linearGradient>
        <linearGradient id="gradOrange" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="rgba(255,200,50,1)" />
          <stop offset="100%" stop-color="rgba(255,200,50,0.3)" />
        </linearGradient>
      </defs>

      <polygon
        points="100,20 170,140 30,140"
        fill="none"
        stroke="url(#gradPurple)"
        stroke-width="5"
      />
      <polygon
        points="100,180 170,60 30,60"
        fill="none"
        stroke="url(#gradOrange)"
        stroke-width="5"
      />
    </svg>
  </div>
</template>

<script lang="ts">
  import { fade } from "svelte/transition";
  import type { SpotifyResponse } from "@pages/api/spotify.json";
  import { onMount } from "svelte";

  let data: SpotifyResponse | undefined = undefined;
  let isLoading = true;
  onMount(async () => {
    const rawResponse = await fetch("/api/spotify.json");
    data = await rawResponse.json();
  });
</script>

<div class="not-prose">
  <div class="relative w-full">
    {#if isLoading}
      <!-- Hide the content behind (to avoid a thumbnail that didn't load to show) -->
      <div
        transition:fade={{ delay: 0, duration: 250 }}
        class="absolute h-full w-full rounded border bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900"
      ></div>
      <!-- Pulse animation on loading -->
      <div
        transition:fade={{ delay: 0, duration: 250 }}
        class="animate-pulse-fast absolute h-full w-full rounded border dark:border-zinc-700"
      >
        <div class="h-full w-full rounded bg-zinc-100 dark:bg-zinc-950" />
      </div>
    {/if}

    <div class="rounded border p-3 dark:border-zinc-700">
      <div class="h-16">
        {#if data && data.name}
          <div class="flex h-full w-full gap-4">
            <div class="w-16 flex-shrink-0 rounded-md">
              <img
                src={data.thumbnailUrl}
                class="aspect-square w-full flex-grow-0 rounded-md"
                width="64"
                height="64"
                on:load={() => (isLoading = false)}
                alt={data.name}
              />
            </div>
            <div
              class="flex w-full flex-col justify-center overflow-hidden text-zinc-700 dark:text-white"
            >
              <a class="w-fit truncate font-bold hover:underline" href={data.href}>
                {data.name}
              </a>
              <span class="text-xs">
                {data.artists[0].name}
              </span>
            </div>
          </div>
        {/if}
        <!-- TODO: Add the unlikely scenario in which Spotify doesn't return anything -->
      </div>
    </div>
  </div>
</div>

<style>
  .animate-pulse-fast {
    animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
</style>

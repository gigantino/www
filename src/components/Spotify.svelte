<script lang="ts">
  import type { SpotifyResponse } from "@pages/api/spotify.json";
  import { onMount } from "svelte";

  let data: SpotifyResponse | undefined = undefined;
  onMount(async () => {
    const rawResponse = await fetch("http://localhost:3000/api/spotify.json");
    data = await rawResponse.json();
  });
</script>

<div class="not-prose">
  <div>
    {#if data && data.isListening}
      <div class="flex items-center justify-between rounded bg-green-500 p-3 text-black">
        <div class="flex gap-3">
          <div class="aspect-square w-14">
            <img src={data.thumbnailUrl} class="rounded" width="56" height="56" alt={data.name} />
          </div>
          <div class=" flex flex-col justify-center">
            <a class="font-bold hover:underline" href={data.href}>{data.name}</a>
            <div>
              {#each data.artists as artist, i}
                <a href={artist.href} class="hover:underline">{artist.name}</a>
                {#if i + 1 != data.artists.length}<span>, </span>{/if}
              {/each}
            </div>
          </div>
        </div>
        <div>
          <button class="h-10 rounded bg-gray-200 px-4 py-1">Listen on Spotify</button>
        </div>
      </div>
    {:else}
      Isn't listening!
    {/if}
  </div>
</div>

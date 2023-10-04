<script lang="ts">
  let isToggled = false;
</script>

<div
  class="group flex w-full flex-col rounded border bg-zinc-50 px-3 py-2 text-gray-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
>
  <button class="flex flex-col items-start gap-2" on:click={() => (isToggled = !isToggled)}>
    <div class="flex items-center gap-2">
      <div class={isToggled ? "rotate down" : "rotate"}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      <div class="font-bold">Public PGP Key</div>
    </div>
    <div
      class="rounded border bg-zinc-100 px-2 text-start font-mono text-sm font-bold text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
    >
      {"29D4 5446 61EE 1AC7 61A9 3B9D 9375 2F01 8455 45C2"}
    </div>
  </button>
  {#if isToggled}
    <div class="prose prose-zinc dark:prose-invert">
      <slot />
    </div>
  {/if}
</div>

<style>
  .rotate {
    -moz-transition: all 120ms linear;
    -webkit-transition: all 120ms linear;
    transition: all 120ms linear;
  }

  .rotate.down {
    -ms-transform: rotate(180deg);
    -moz-transform: rotate(180deg);
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
  }
</style>

<script lang="ts">
  let isToggled = false;
</script>

<button
  class="group flex w-full flex-col gap-2 rounded border bg-zinc-50 px-3 py-2 text-gray-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
  on:click={() => (isToggled = !isToggled)}
>
  <div class="flex gap-2">
    <span class="font-bold">Public PGP Key</span>
    <span
      class="flex items-center rounded border border-zinc-700 bg-zinc-900 px-2 font-mono text-sm font-bold"
    >
      ABCD ABCD ABCD ABCD ABCD ABCD ABCD ABCD ABCD ABCD
    </span>
  </div>
  {#if isToggled}
    <div class="w-full rounded border border-zinc-700">This will contain a PGP Key!</div>
  {/if}
</button>

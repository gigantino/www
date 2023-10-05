<script lang="ts">
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";

  let ready = false;
  onMount(() => {
    ready = true;
  });

  const getGreeting = () => {
    const languageCode = navigator.language.split("-")[0];
    const greetings = {
      es: "hola",
      fr: "bonjour",
      de: "hallo",
      it: "ciao",
      pt: "olá",
      nl: "hallo",
      pl: "cześć",
      sv: "hej",
      da: "hej",
      no: "hei",
      fi: "hei",
      el: "γειά σας",
      hu: "helló",
      cz: "ahoj",
    };
    return (greetings[languageCode as keyof typeof greetings] || "hello") as string;
  };
</script>

{#if ready}
  <h1 transition:fade>{getGreeting()}! 👋</h1>
{:else}
  <!-- Dirty hack to avoid a layout shift before the JS gets loaded -->
  <h1 style="opacity: 0;">hello! 👋</h1>
{/if}

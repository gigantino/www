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
  <h1 transition:fade>{getGreeting()}! <span class="wave">👋</span></h1>
{:else}
  <!-- Dirty hack to avoid a layout shift before the JS gets loaded -->
  <h1 style="opacity: 0;">hello! 👋</h1>
{/if}

<style>
  .wave {
    animation-name: wave-animation;
    animation-duration: 2s;
    animation-iteration-count: 1;
    transform-origin: 70% 70%;
    display: inline-block;
    animation-delay: 2s;
  }

  @keyframes wave-animation {
    0%,
    100% {
      transform: rotate(0deg);
    }
    10% {
      transform: rotate(14deg);
    }
    20% {
      transform: rotate(-8deg);
    }
    30% {
      transform: rotate(14deg);
    }
    40% {
      transform: rotate(-4deg);
    }
    50% {
      transform: rotate(10deg);
    }
    60% {
      transform: rotate(0deg);
    }
  }
</style>

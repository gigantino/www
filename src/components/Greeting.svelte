<script lang="ts">
  const languageCode: string = navigator.language.split("-")[0];
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
  const greeting = (greetings[languageCode as keyof typeof greetings] || "hello") as string;
</script>

<h1>{greeting}! 👋</h1>

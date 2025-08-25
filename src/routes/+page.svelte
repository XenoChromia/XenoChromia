<script lang="ts">
let input = "";
let commands = [
    "whoami",
    "skills",
    "experience",
    "help",
    "clear"
]
type Command = keyof typeof commandOutput;
let history: { command: string; output: string }[] = [];
let term: HTMLElement;

let commandOutput: Record<string, string> = {
  help: `
    <div class="rounded-2xl shadow-lg p-4 w-full">
      <p class="">Available commands:</p>
      <ul class="list-disc pl-5 text-gray-700 space-y-1 mt-2">
        <li><span class="font-mono text-green-600">whoami</span> → About Me</li>
        <li><span class="font-mono text-green-600">skills</span> → Skills Overview</li>
        <li><span class="font-mono text-green-600">experience</span> → Experience</li>
      </ul>
    </div>
  `,
  whoami: `
        Hi, I’m a developer passionate about coding, open source, and problem solving.  
        I love working on creative projects and exploring new technologies.
  `,
  skills: `
        Programming: Go, TypeScript, Python
        Systems: Linux, Docker, Cloud
        Security & Networking basics
  `,
  experience: `
      I’ve worked on projects involving:
        <li>Building full-stack web applications</li>
        <li>Cloud deployment & automation</li>
        <li>Contributions to open-source projects</li>
  `
}

async function runCommand(cmd: string) {
    if (cmd == "clear") {
        history = []
        return;
    }else if (!(cmd in commandOutput)) return;

    const text = commandOutput[cmd as Command];
    let output = "";

    history = [...history, { command: cmd, output: "" }];
    const index = history.length - 1;

    for (let i = 0; i < text.length; i++) {
        output += text[i];
        history[index].output = output;
        history = [...history];
        await new Promise(r => setTimeout(r, 5));
    }
    term.scrollTop = term.scrollHeight;
}


function handleEnter(event: KeyboardEvent) {
    if (event.key === "Enter") {
        event.preventDefault();
        if (commands.includes(input)) {
            runCommand(input);
            console.log(history)
        }
      input = "";
    }
}

</script>

<div class="w-full grid grid-cols-1 lg:grid-cols-3">
    <div class="col-span-2 relative">
        <img src="/comp.svg" alt="Computer" class="w-full sm:h-full"/>
        <div class="-z-20 absolute top-0 left-0 h-[38%] mt-[25%] w-[70%]">
            <h1 class="text-2xl font-bold text-center bg-gray-500 20 text-white absolute top-0 left-0 w-full" >WaiMeng@debian</h1>
            <canvas id="Screen" class="w-full h-full text-white absolute opacity-100 flex flex-col gap-24 bg-gray-900 rounded-md -z-20"></canvas>
        </div>

        <!-- Terminal -->
        <div class="absolute top-0 left-0 mt-[30%] mx-4 w-[65%] h-[33%] z-10 overflow-y-scroll gap-auto flex flex-col text-white" bind:this={term}>
            {#each history as entry}
                <div>waimeng@debian> {entry.command}</div>
                <div>{entry.output}</div>
            {/each}
            <div class="flex flex-row">
                <p class="flex items-center">waimeng@debian></p>
                <input type="text" bind:value={input} onkeydown={handleEnter} class="w-full bg-transparent text-white border-none outline-none" placeholder="Type here">
            </div>
        </div>
    </div>

    <!-- Right profile -->
    <div class="flex flex-col gap-12 w-full h-dvh justify-center items-center px-12">
        <img src="pfp.png" alt="Picture of me" class="rounded-full w-1/2">
        <div>
            <h1 class="text-white text-4xl font-bold w-full">Hallo, I'm Wai Meng</h1>
            <p class="text-white text-2xl"> Currently, I am a Y2 student studying Ngee Ann Polytechnic in Singapore.</p>
        </div>
    </div>
</div>

<style>
input:focus {
    outline: none;
    box-shadow: none;
}
</style>

<script lang="ts">
import { Mail, Github, Linkedin } from 'lucide-svelte';

let input = "";
let commands = [
    "/about",
    "/skills",
    "/experience",
    "/help",
    "/secret",
    "/blog",
    "/clear"
]
type Command = keyof typeof commandOutput;
let history: { command: string; output: string }[] = [];
let term: HTMLElement;
export let data;

let commandOutput: Record<string, string> = {
    "/help": `
        <div class="p-4 w-full">
            <p class="">Available commands:</p>
            <ul class="list-disc pl-5 space-y-1 mt-2">
                <li><span class="font-mono text-green-600">/about</span> → About Me</li>
                <li><span class="font-mono text-green-600">/skills</span> → Skills Overview</li>
                <li><span class="font-mono text-green-600">/experience</span> → Experiences Overview</li>
                <li><span class="font-mono text-green-600">/clear</span> → Clears the terminal</li>
            </ul>
        </div>
  `,
    "/about": `
        <div class="p-4 w-full">
            <p>Hi, I’m a 19 Year old student developer passionate about <span class="font-mono text-blue-600">coding</span>, <span class="font-mono text-red-600">open source</span>, and problem solving.
            I love learning and exploring new technologies and I love using <span class="font-mono text-orange-600">Linux</span>.</p>
        </div>
        
  `,
    "/skills": `
        <div class="p-4 w-full">
            <ul>
                <li>Programming Languages: TypeScript/JavaScript, Python, C#, Go</li>
                <li>Systems: Linux, Cloud(AWS)</li>
                <li>Web Dev: React, Svelte, Vercel</li>
                <li>Agile/Scrum</li>
            </ul>
        </div>
  `,
    "/experience": `
      Projects:
        <li>This website is my "first" actual project. Made with sveltekit</li>
        <li>TBC...</li>
  `, 
    "/blog":`TBC...`,
    "/secret": `
        <pre class="w-full" style="font-size: 0.5rem">
            ${data.art}
        </pre>`
}

async function runCommand(cmd: string) {
    if (cmd == "/clear") {
        history = []
        return;
    } else if (cmd == "/secret") {
        history = [...history, { command: cmd, output: commandOutput["/secret"] }];
        term.scrollTop = term.scrollHeight;
        return;
    } else if (!(cmd in commandOutput)) {
        return;
    }

    const text = commandOutput[cmd as Command];
    let output = "";

    history = [...history, { command: cmd, output: "" }];
    const index = history.length - 1;

    for (let i = 0; i < text.length; i++) {
        output += text[i];
        history[index].output = output;
        history = [...history];
        await new Promise(r => setTimeout(r, 2.5));
    }
    term.scrollTop = term.scrollHeight;
}


function handleEnter(event: KeyboardEvent) {
    if (event.key === "Enter") {
        event.preventDefault();
        if (commands.includes(input)) {
            runCommand(input);
        } else {
            history = [...history, {command: input, output: "Sorry, that is an invalid command. Type /help to get a list of available commands"}]
        }
        term.scrollTop = term.scrollHeight;
      input = "";
    }
}

</script>

<div class="w-full grid grid-cols-1 lg:grid-cols-3">
    <div class="col-span-2 relative">
        <img src="/comp.svg" alt="Computer" class="w-full sm:h-full"/>
        <div class="-z-20 absolute top-0 left-0 h-[38%] mt-[25%] w-[70%] overflow-x-clip">
            <h1 class="text-xl font-bold text-center bg-gray-900 text-white absolute top-0 left-0 w-full py-2" >WaiMeng@debian</h1>
            <canvas id="Screen" class="w-full h-full text-white absolute opacity-100 flex flex-col gap-24 bg-black rounded-md -z-20"></canvas>
        </div>

        <!-- Terminal -->
        <div class="absolute top-0 left-0 mt-[30%] mx-4 w-[65%] h-[33%] z-10 overflow-y-scroll gap-auto flex flex-col text-white" bind:this={term}>
            {#each history as entry}
                <div>waimeng@debian> {entry.command}</div>
                <div>{@html entry.output}</div>
            {/each}
            <div class="flex flex-col sm:flex-row">
                <p class="flex items-center">waimeng@debian></p>
                <input type="text" bind:value={input} onkeydown={handleEnter} class="w-full bg-transparent text-white border-none outline-none" placeholder="Type here">
            </div>
        </div>
    </div>

    <!-- Right profile -->
    <div class="flex flex-col gap-12 w-full h-dvh justify-center items-center px-12">
        <img src="pfp.png" alt="Picture of me" class="rounded-full w-1/2">
        <div class="flex flex-col gap-4">
            <div>
                <h1 class="text-white text-4xl font-bold w-full">Hallo, I'm Wai Meng</h1>
                <p class="text-white text-2xl"> Currently, I am a Y2 student studying Ngee Ann Polytechnic in Singapore.</p>
            </div>
            <div class="flex gap-4">
                <a href="https://mail.google.com/mail/u/0/#inbox?compose=GTvVlcRwRCZmPWHsgCfPBWNslmRBzBlKwsMQlcHzckFqLBGdtLTMZQJKvGlsbHfdRRzMrvtTCcHph" target="_blank" class="cursor-pointer">
                    <Mail color="white" size={52} /> 
                </a>
                <a href="https://github.com/XenoChromia" target="_blank" class="cursor-pointer">
                    <Github color="white" size={52}/>
                </a>
                <a href="https://www.linkedin.com/in/leong-wai-meng-990897278/" target="_blank" class="cursor-pointer">
                    <Linkedin color="white" size={52}/>
                </a>
            </div>
        </div>
    </div>
</div>

<style>
input:focus {
    outline: none;
    box-shadow: none;
}
@import url("https://fonts.googleapis.com/css?family=Inconsolata|Roboto+Mono|Ubuntu+Mono|Cutive+Mono");
pre{
display: inline-block;
font-size: 7px;
text-align: center;
font-family: Ubuntu Mono, monospace !important;
text-rendering: optimizeSpeed;
}
</style>


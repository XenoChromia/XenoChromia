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
    "/credits",
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
                <li><span class="font-mono text-green-600">/credits</span> → Images Credits</li>
                <li><span class="font-mono text-green-600">/clear</span> → Clears the terminal</li>
            </ul>
        </div>
  `,
    "/about": `
        <div class="p-4 w-full">
            <p>Hi, I’m a 19 Year old student developer passionate about <span class="font-mono text-blue-600">coding</span> and <span class="font-mono text-red-600">open source</span>. 
            I love learning and exploring new technologies and I love using <span class="font-mono text-orange-500">Linux</span> :0.</p>
            <p>Currently, looking for networking opportunities and internships for 2026.</p>
        </div>
        
  `,
    "/skills": `
        <div class="p-4 w-full">
            <ul class="list-disc">
                <li>Programming Languages: TypeScript/JavaScript, Python, C#</li>
                <li>Systems: Linux, Cloud(AWS)</li>
                <li>Web Dev: React, Svelte, Vercel</li>
                <li>Agile/Scrum</li>
            </ul>
        </div>
  `,
    "/experience": `
        <div class="p-4 w-full">
            <p>Projects:</p>
            <ul class="list-disc">
                <li>This <span class="font-mono text-blue-600"><a href="https://github.com/XenoChromia/XenoChromia">website</a></span> is my "first" actual project. Made with <span class="font-mono text-orange-600"><a href="https://svelte.dev/docs/kit/introduction" class="cursor-pointer">sveltekit</a></span></li>
                <li>TBC...</li>
            </ul>
        </div>
  `, 
    "/credits":`
        <div class="p-4 flex flex-col">
            <a href="https://www.freepik.com/free-photo/retro-computer-technology-with-monitor-hardware_34134892.htm#fromView=keyword&page=1&position=6&uuid=f7a80659-1a82-4493-84d3-47b515f26e18&query=Old+computer" class="cursor-pointer" target="_blank">Image of Computer</a>
            <a href="https://avatars.alphacoders.com/avatars/view/131507" class="cursor-pointer" target="_blank">Image of Profile Picture</a>
        </div>`,
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
    } else if (cmd == "/blog") {
        window.location.href = "/blog"
    }else if (!(cmd in commandOutput)) {
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
        <div id="term" class="absolute top-0 translate-y-2/3 left-0 mx-4 w-[65%] h-[33%] z-10 overflow-y-scroll gap-auto flex flex-col text-white" bind:this={term}>
            {#each history as entry}
                <div>waimeng@debian> {entry.command}</div>
                <div>{@html entry.output}</div>
            {/each}
            <div class="flex flex-col sm:flex-row">
                <p class="flex items-center">waimeng@debian></p>
                <input type="text" bind:value={input} onkeydown={handleEnter} class="w-full bg-transparent text-white border-none outline-none " placeholder="Type here">
            </div>
        </div>
    </div>

    <!-- Right profile -->
    <div class="flex flex-col gap-12 w-full h-dvh justify-center items-center px-12">
        <img src="pfp.jpg" alt="Picture of me" class="text-white rounded-full w-52 h-52">
        <div class="flex flex-col gap-4">
            <div>
                <h1 class="text-white text-4xl font-bold w-full">Hello, I'm Wai Meng</h1>
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

#term::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
#term {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

</style>


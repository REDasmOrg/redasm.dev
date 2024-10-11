export default {
    title: "Features",

    template: /*html*/`
    <article>
        REDasm is under heavy development but it provides several interesting features:
        <ul class="list-disc list-inside">
            <li>IDA-Like interactive listing</li>
            <li>Multithreaded analysis</li>
            <li>Graphing support</li>
            <li>Runs on Windows and Linux</li>
            <li>Easy to use</li>
            <li>Plain C API</li>
            <li>Plugin Support</li>
        </ul>
        <div class="flex justify-evenly p-5">
            <section>
                <h2 class="font-bold">SUPPORTED LOADERS</h2>
                <ul>
                    <li>Portable Executable (PE)</li>
                    <li>ELF Executable</li>
                    <li>Sony Playstation 1 Executable</li>
                    <li>Sony Playstation 1 Bios</li>
                    <li>XBox1 Executable (XBE)</li>
                    <li>ESP32 Roms</li>
                    <li>DEX</li>
                </ul>
            </section>
            <section>
                <h2 class="font-bold">SUPPORTED ASSEMBLERS</h2>
                <ul>
                    <li>x86 &amp; x86_64</li>
                    <li>MIPS</li>
                    <li>ARM64</li>
                    <li>CHIP-8</li>
                    <li>XTensa</li>
                    <li>Dalvik</li>
                </ul>
            </section>
        </div>
        Check the <a href="/roadmap">Roadmap</a> for more features and ideas or
        <a href="https://github.com/REDasmOrg/REDasm/issues">open an issue on GitHub!</a>
    </article>
    `
};

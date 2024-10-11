export default {
    template: /*html*/`
    <article>
        <img class="float-left mt-[-50px]" alt="logo" src="/logo.png">
        <p>
            REDasm is a cross platform disassembler with a modern codebase useful from the hobbyist 
            to the professional reverse engineer.
        </p>
        <p>
            All features are provided by <a class="link" href="https://github.com/REDasmOrg/REDasm-Library">LibREDasm</a>
            which loads plugins developed in C, C++ and Python3 (you can also support new languages if you want!) 
            and an user friendly Qt frontend.
        </p>
        <p>You can hack and improve REDasm without any issues and limitations.</p>
        <p class="text-right italic py-3">Runs on Windows and Linux.</p>
    </article>
    <img-carousel>
        <img src="/carousel/1.png">
        <img src="/carousel/2.png">
        <img src="/carousel/3.png">
        <img src="/carousel/4.png">
    </img-carousel>
    `
};

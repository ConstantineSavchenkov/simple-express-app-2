// this his huge simplification of possible logger

export class Logger{

    private readonly level: string
    private readonly sublevel: string

    constructor(level:string, sublevel?:string){
        this.level = level
        this.sublevel = sublevel || ""
    }

    public info(...args: unknown[]){
        console.log(`::${this.level}::${this.sublevel} `+ args.join())
    }

    public debug(...args: unknown[]){
        console.debug(`::${this.level}::${this.sublevel} ` + args.join())
    }

   public error(...args: unknown[]){
        console.error(`::${this.level}::${this.sublevel} `+ args.join())
    }
}

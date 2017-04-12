class Injector {
    constructor () {
        this.MATCH_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m
        this.dependencies = {}   
    } 

    register (token, dep) {
        if(this.dependencies.hasOwnProperty(token)) {
            throw new Error(`${token} already registered`)
        } 
        this.dependencies[token] = dep;
    }  

    process (target) {
        let str = target.toString();
        let args = str.match(this.MATCH_ARGS).pop().replace(/\s\s/g, ' ').split(',');
        target.apply(target, this.getDependencies(args));
    } 

    getDependency (token) {
        return this.dependencies[token]
    } 

    getDependencies (args) {
        return args.map(dep=>this.dependencies[dep])
    } 

    static getInstance () {
        if(!Injector._instance) {
            Injector._instance = new Injector();
        } 
        return Injector._instance;
    } 
} 

//test

const injector = Injector.getInstance();

const logger = {
    log() {
        console.log('test log') 
    } 
} 

function test(dep) {
    dep.log()
} 

injector.register('dep', logger) 
injector.process(test) //=> 'test log'



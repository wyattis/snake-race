class SignalManager{
    
    constructor(){
        this.signals = [];
    }
    
    add(cb, timeout, context, timestamp){
        this.signals.push({
            cb: cb,
            emitTime: (timestamp || performance.now()) + timeout,
            context: context,
        });
    }
    
    tick(timestamp){
        
        let i = this.signals.length;
        while(i--){
            if(timestamp >= this.signals[i].emitTime){
                let signal = this.signals.splice(i, 1)[0];
                signal.cb.call(signal.context);
            }
        }
        
    }
    
}

module.exports = SignalManager;
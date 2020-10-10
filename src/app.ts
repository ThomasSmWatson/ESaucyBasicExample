import {EventBasedService, ICommand, ICommandHandler, IEvent, IEventStore, IProjector, IState} from "esaucy"

const generateRandomNumber = ():number => Math.floor(Math.random() * 100)+ 1

interface BetAmountCommand extends ICommand {
    id: string
    date: Date
    amountBet: number
}
interface BetPlacedEvent extends IEvent {
    amountBet: number,
    numberRolled: number,
    won: boolean
}

class UserMoneyState implements IState {
    index: number
    money: number
}

class BetAmountCommandHandler implements ICommandHandler<BetAmountCommand, BetPlacedEvent>{
    async execute(command: BetAmountCommand): Promise<BetPlacedEvent> {        
        const number = generateRandomNumber()

        const event:BetPlacedEvent = {
            numberRolled: number,
            amountBet: command.amountBet,
            date: new Date(),
            id: `betPlaced-${new Date()}`,
            won: false
        }

        if(number > 52) event.won = true
        else event.won = false

        return event;
    }

}

class BetPlacedProjector implements IProjector<BetPlacedEvent, UserMoneyState>{
    async project(currentState: UserMoneyState, event: BetPlacedEvent): Promise<UserMoneyState> {
        const newState: UserMoneyState = {
            index: currentState.index +1,
            money: event.won? currentState.money+event.amountBet: currentState.money-event.amountBet
        }
        return newState;
    }

}


class LocalEventStore implements IEventStore{
    private store : any = {}
    async publish(event: IEvent): Promise<boolean> {
        this.store[event.id] = event

        return true
    }

}

class BetService extends EventBasedService<BetAmountCommand,BetPlacedEvent,UserMoneyState> {

    constructor(){
        super(new BetAmountCommandHandler(), new BetPlacedProjector(), new LocalEventStore())
    }

    protected async  updateState(_: UserMoneyState): Promise<void> {
        
    }

    protected async getCurrentState(_: BetPlacedEvent): Promise<UserMoneyState> {
        return {
            index: 0,
            money: 0
        }
    }

}

const service = new BetService()

const input = { amountBetBTC: 1.2342627 }
const command:BetAmountCommand = {
    amountBet: input.amountBetBTC,
    date: new Date(),
    id: "AmountBetBTC"
}

service.execute(command).then(result => {
    console.log(result)
})


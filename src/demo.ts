import type {FigureLayout,LoteriaBoard} from './types';
const layouts:FigureLayout[]=['horizontal','vertical','diagonal-a','diagonal-b'];
export const demoBoards:LoteriaBoard[]=Array.from({length:3},(_,b)=>{const now=new Date().toISOString();return{id:`demo-${b+1}`,name:`Tabla muestra ${b+1}`,cells:Array.from({length:16},(_,p)=>({position:p,figureId:(p+b*16)%54+1,layout:layouts[(p+b)%4]})),createdAt:now,updatedAt:now}});
export const demoSequence=[1,7,3,24,35,46,54,27,42,16];

import { SvgDefs } from './components/SvgDefs';
import { HeartsCanvas } from './components/HeartsCanvas';
import { Scene } from './components/Scene';
import { Memories } from './components/Memories';
import { Counter } from './components/Counter';
import { Finale } from './components/Finale';

export default function App() {
  return (
    <>
      <SvgDefs />
      <HeartsCanvas />
      <main>
        <Scene />
        <Memories />
        <Counter />
        <Finale />
      </main>
    </>
  );
}

import './App.css';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';

function App() {
  return (
    <div className="p-10 flex flex-col gap-5">
      <h1 className="text-xl font-bold">Homepage</h1>
      <h1 className="text-sm font-bold">App Component</h1>
      <Button variant="default">Shadcn default button</Button>
      <Input placeholder="Enter name" />
    </div>
  );
}

export default App;

import Searchbar from '../components/Searchbar';

function Home() {
  return (<>
    <div id='title-screen'>
      <h1>捨nime</h1>
      <Searchbar />
      <p id="greeting">
        {greetings[Math.floor(Math.random() * greetings.length)]}
      </p>
    </div>
  </>);
}

export default Home;

const greetings: string[] = [
  "(*・ω・)ﾉ",
  "(￣▽￣)ノ",
  "(°▽°)/",
  "( ´ ∀ ` )ﾉ",
  "(^-^*)/",
  "(＠´ー`)ﾉﾞ",
  "(´• ω •`)ﾉ",
  "( ° ∀ ° )ﾉﾞ",
  "ヾ(*'▽'*)",
  "＼(⌒▽⌒)",
  "ヾ(☆▽☆)",
  "( ´ ▽ ` )ﾉ",
  "(^０^)ノ",
  "~ヾ(・ω・)",
  "(・∀・)ノ",
  "ヾ(・ω・*)",
  "(*°ｰ°)ﾉ",
  "(・_・)ノ",
  "(o´ω`o)ﾉ",
  "( ´ ▽ ` )/",
  "(￣ω￣)/",
  "( ´ ω ` )ノﾞ",
  "(⌒ω⌒)ﾉ",
  "(o^ ^o)/",
  "(≧▽≦)/",
  "(✧∀✧)/",
  "(o´▽`o)ﾉ",
  "(￣▽￣)/"
];
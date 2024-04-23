import { getAnimeSearch } from "../utils/api";
import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { IAnimeResult, ITitle } from "@consumet/extensions";

function Searchbar() {
  const [query, setQuery] = useState<string>("");

  const [resultsList, setResultsList] = useState<IAnimeResult[]>();
  const [currentPage, setCurrentPage] = useState<number | undefined>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean | undefined>(false);

  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedIndex(-1);
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const search = await getAnimeSearch(query, 1);

    setResultsList(
      search?.results
        .filter(result => result.subOrDub === "sub")
    );
    setCurrentPage(search?.currentPage);
    setHasNextPage(search?.hasNextPage);
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!resultsList) return

      const total = resultsList.length;
      let index = selectedIndex;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          index = (index - 1 + total) % (total);
          break;
        case 'ArrowDown':
          e.preventDefault();
          index = (index + 1) % (total);
          break;
        case 'Enter':
          if (selectedIndex != -1) {
            e.preventDefault();
            console.log(resultsList[index].id);
          }
          break;
      }

      setSelectedIndex(index);
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [resultsList, selectedIndex])

  return (
    <>
      <form spellCheck='false' onSubmit={(e) => handleSubmit(e)}>
        <input
          className={resultsList ? 'flat-bottom-br' : ''}
          placeholder='Search'
          value={query}
          onChange={(e) => handleInputChange(e)}
          autoFocus
        />
      </form>
      {resultsList &&
        <ul id='search-results'>
          {resultsList.length !== 0 ?
            resultsList.map((result, index) =>
              <Result
                key={result.id}
                result={result}
                isSelected={index === selectedIndex}
              />
            ) :
            <li>
              No results
            </li>
          }
        </ul>
      }
    </>
  )
}

function Result({ result, isSelected }: { result: IAnimeResult, isSelected: boolean }) {
  return (
    <li className={isSelected ? 'selected' : ''} onClick={() => console.log(result.id)}>
      {typeof result.title === 'string' ?
        result.title :
        result.title.romaji || result.title.english}
    </li>
  )
}

export default Searchbar
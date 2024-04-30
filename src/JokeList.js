import React, { Component, useEffect, useState } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */

function JokeList({ numOfJokes = 5 }) {
  const [jokes, setJokes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(
    function () {
      async function getJokes() {
        let js = [...jokes];
        let seenJokes = new Set();
        try {
          while (js.length < numOfJokes) {
            const res = await axios.get("https://icanhazdadjoke.com", {
              headers: { Accept: "application/json" },
            });

            let { ...jokeObj } = res.data;
            if (!seenJokes.has(jokeObj.id)) {
              js.push({ ...jokeObj, votes: 0 });
            } else {
              console.error("duplicate!");
            }
          }
          setJokes(js);
          setIsLoading(false);
        } catch (err) {
          console.error(err);
        }
      }
      if (jokes.length === 0) getJokes();
    },
    [jokes, numOfJokes]
  );

  /* empty joke list, set to loading state, and then call getJokes */

  function generateNewJokes() {
    setJokes([]);
    setIsLoading(true);
  }

  /* change vote for this id by delta (+1 or -1) */

  function vote(id, delta) {
    setJokes((allJokes) =>
      allJokes.map((j) => (j.id === id ? { ...j, votes: j.votes + delta } : j))
    );
  }

  if (isLoading) {
    return <div>...Loading</div>;
  }

  let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

  return (
    <div className="JokeList">
      <button className="JokeList-getmore" onClick={generateNewJokes}>
        Get New Jokes
      </button>

      {sortedJokes.map((j) => (
        <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={vote} />
      ))}
    </div>
  );
}

export default JokeList;

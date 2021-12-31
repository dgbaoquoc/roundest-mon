import { getOptionsForVote } from "@/utils/getRandomPokemon";
import { trpc } from "@/utils/trpc";
import type { NextPage } from "next";
import { useState } from "react";
import { inferQueryResponse } from "./api/trpc/[trpc]";

const Home: NextPage = () => {
  const [ids, updateIds] = useState(getOptionsForVote());
  const [first, second] = ids;

  const firstPokemon = trpc.useQuery([
    "get-pokemon-by-id",
    {
      id: first,
    },
  ]);

  const secondPokemon = trpc.useQuery([
    "get-pokemon-by-id",
    {
      id: second,
    },
  ]);

  if (firstPokemon.isLoading || secondPokemon.isLoading) return null;

  const voteForRounder = (selected: number) => {
    updateIds(getOptionsForVote());
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center pt-8">Which Pokemon is rounder?</div>
      <div className="p-2" />
      <div className="border rounded p-8 flex justify-between items-center max-w-2xl">
        {!firstPokemon.isLoading &&
          firstPokemon.data &&
          !secondPokemon.isLoading &&
          secondPokemon.data && (
            <>
              <PokemonListing
                pokemon={firstPokemon.data}
                vote={() => voteForRounder(first)}
              />
              <div className="p-8 italic text-xl">{"or"}</div>
              <PokemonListing
                pokemon={secondPokemon.data}
                vote={() => voteForRounder(second)}
              />
              <div className="p-2"></div>
            </>
          )}
      </div>
    </div>
  );
};

type PokemonFromServer = inferQueryResponse<"get-pokemon-by-id">;
type PokemonListingProps = {};

const PokemonListing: React.FC<{
  pokemon: PokemonFromServer;
  vote: () => void;
}> = (props) => {
  return (
    <div className="flex flex-col items-center">
      <img
        src={props.pokemon.sprites.front_default || undefined}
        className="w-64 h-64"
      />
      <div className="text-xl text-center capitalize mt-[-2rem]">
        {props.pokemon.name}
      </div>
      <button className="custom-btn" onClick={() => props.vote()}>
        Rounder
      </button>
    </div>
  );
};

export default Home;

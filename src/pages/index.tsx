import { getOptionsForVote } from "@/utils/getRandomPokemon";
import { trpc } from "@/utils/trpc";
import type { NextPage } from "next";
import { useState } from "react";
import { inferQueryResponse } from "./api/trpc/[trpc]";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

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

  const voteMutation = trpc.useMutation(["cast-vote"]);

  const voteForRounder = (selected: number) => {
    if (selected === first) {
      voteMutation.mutate({ votedFor: first, votedAgainst: second });
    } else {
      voteMutation.mutate({ votedFor: second, votedAgainst: first });
    }

    updateIds(getOptionsForVote());
  };

  const dataLoaded =
    !firstPokemon.isLoading &&
    firstPokemon.data &&
    !secondPokemon.isLoading &&
    secondPokemon.data;

  return (
    <div className="h-screen w-screen flex flex-col justify-between items-center relative">
      <Head>
        <title>Roundest Pokemon</title>
      </Head>
      <div className="text-2xl text-center pt-8">Which Pokemon is Rounder?</div>
      <div className="p-2" />
      <div className="p-8 flex justify-between items-center max-w-2xl flex-col md:flex-row animate-fade-in">
        {dataLoaded && (
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
        {!dataLoaded && <img src="/rings.svg" className="w-48" />}
      </div>
      <div className="w-full text-xl text-center pb-2">
        <a href="https://github.com/dgbaoquoc/roundest-mon">Github</a>
        {" | "}
        <Link href="/results">
          <a href="Results">Results</a>
        </Link>
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
      <Image
        src={props.pokemon.spriteUrl}
        width={256}
        height={256}
        className="w-64 h-64"
        layout="fixed"
      />
      <div className="text-xl text-center capitalize mt-[-2rem]">
        {props.pokemon.name}
      </div>
      <button className="custom-btn mt-2" onClick={() => props.vote()}>
        Rounder
      </button>
    </div>
  );
};

export default Home;

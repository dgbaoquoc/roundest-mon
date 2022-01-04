import { trpc } from "@/utils/trpc";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { inferQueryResponse } from "./api/trpc/[trpc]";

const Home: NextPage = () => {
  const {
    data: pokemonPair,
    refetch,
    isLoading,
  } = trpc.useQuery(["get-pokemon-pair"], {
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const voteMutation = trpc.useMutation(["cast-vote"]);

  const voteForRounder = (selected: number) => {
    if (!pokemonPair) return;

    if (selected === pokemonPair?.firstPokemon.id) {
      voteMutation.mutate({
        votedFor: pokemonPair.firstPokemon.id,
        votedAgainst: pokemonPair.secondPokemon.id,
      });
    } else {
      voteMutation.mutate({
        votedFor: pokemonPair.secondPokemon.id,
        votedAgainst: pokemonPair.firstPokemon.id,
      });
    }

    refetch();
  };

  const fetchingNext = voteMutation.isLoading || isLoading;

  return (
    <div className="h-screen w-screen flex flex-col justify-between items-center relative overflow-hidden">
      <Head>
        <title>Roundest Pokemon</title>
      </Head>
      <div className="text-2xl text-center pt-8">Which Pokemon is Rounder?</div>
      <div className="p-8 flex justify-between items-center max-w-2xl flex-col md:flex-row animate-fade-in">
        {pokemonPair && (
          <>
            <PokemonListing
              pokemon={pokemonPair.firstPokemon}
              vote={() => voteForRounder(pokemonPair.firstPokemon.id)}
              disabled={fetchingNext}
            />
            <div className="p-8 italic text-xl">{"or"}</div>
            <PokemonListing
              pokemon={pokemonPair.secondPokemon}
              vote={() => voteForRounder(pokemonPair.secondPokemon.id)}
              disabled={fetchingNext}
            />
            <div className="p-2"></div>
          </>
        )}
        {!pokemonPair && <img src="/rings.svg" className="w-48" />}
      </div>
      <div className="w-full text-xl text-center pb-2">
        <a href="https://github.com/dgbaoquoc/roundest-mon">Github</a>
        <span className="p-4">{"-"}</span>
        <Link href="/results">
          <a href="Results">Results</a>
        </Link>
      </div>
    </div>
  );
};

type PokemonFromServer = inferQueryResponse<"get-pokemon-pair">["firstPokemon"];

const PokemonListing: React.FC<{
  pokemon: PokemonFromServer;
  vote: () => void;
  disabled: boolean;
}> = (props) => {
  return (
    <div
      className={`flex flex-col items-center transition-opacity ${
        props.disabled && "opacity-0"
      }`}
      key={props.pokemon.id}
    >
      <div className="text-xl text-center capitalize mt-[-0.5rem]">
        {props.pokemon.name}
      </div>
      <Image
        src={props.pokemon.spriteUrl}
        width={256}
        height={256}
        layout="fixed"
        className="animate-fade-in"
      />
      <button
        className="custom-btn"
        onClick={() => props.vote()}
        disabled={props.disabled}
      >
        Rounder
      </button>
    </div>
  );
};

export default Home;

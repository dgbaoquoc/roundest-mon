import { GetStaticProps } from "next";
import { prisma } from "@/backend/utils/prisma";
import { AsyncReturnType } from "@/backend/utils/ts-bs";
import Image from "next/image";
import Head from "next/head";

const getPokemonInOrder = async () => {
  return await prisma.pokemon.findMany({
    orderBy: {
      VoteFor: { _count: "desc" },
    },
    select: {
      id: true,
      name: true,
      spriteUrl: true,
      _count: {
        select: {
          VoteFor: true,
          VoteAgainst: true,
        },
      },
    },
  });
};

type PokemonQueryResult = AsyncReturnType<typeof getPokemonInOrder>;

const generateCountPercent = (pokemon: PokemonQueryResult[number]) => {
  const { VoteFor, VoteAgainst } = pokemon._count;
  if (VoteFor + VoteAgainst === 0) {
    return 0;
  }

  return (VoteFor / (VoteAgainst + VoteFor)) * 100;
};
const PokemonListing: React.FC<{ pokemon: PokemonQueryResult[number] }> = ({
  pokemon,
}) => {
  return (
    <div className="flex border-b p-2 items-center justify-between">
      <div className="flex items-center">
        <Image src={pokemon.spriteUrl} width={64} height={64} />
        <div className="capitalize">{pokemon.name}</div>
      </div>
      <div className="pr-4">
        {generateCountPercent(pokemon).toFixed(2) + "%"}
      </div>
    </div>
  );
};

const ResultsPage: React.FC<{
  pokemon: PokemonQueryResult;
}> = ({ pokemon }) => {
  return (
    <div className="flex flex-col items-center">
      <Head>
        <title>Roundest Pokemon Results</title>
      </Head>
      <h2 className="text-2xl p-4">Resutls</h2>
      <div className="flex flex-col w-full max-w-2xl border">
        {pokemon
          .sort((a, b) => {
            const diff = generateCountPercent(b) - generateCountPercent(a);
            if (diff === 0) {
              return b._count.VoteFor - a._count.VoteFor;
            }

            return diff;
          })
          .map((currentPokemon, index) => {
            return <PokemonListing pokemon={currentPokemon} key={index} />;
          })}
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const pokemonOrdered = await getPokemonInOrder();

  return {
    props: {
      pokemon: pokemonOrdered,
    },
    revalidate: 60,
  };
};

export default ResultsPage;

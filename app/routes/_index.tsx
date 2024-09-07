import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
	return [{ title: "Embed | Movie Central" }, { name: "description", content: "Free embed" }];
};

export default function Index() {
	return (
		<div className="flex flex-col gap-2 p-4 text-lg">
			<h1 className="text-4xl font-semibold">Endpoints</h1>
			<div className="flex flex-col p-4 bg-zinc-200">
				<div className="text-xl font-semibold">
					Movie Embed: <span className="font-semibold">https://embed.moviecentral.xyz/movie/TMDBID</span>
				</div>
				<div className="font-semibold">
					<span className="font-normal">iframe code: </span>
					{`<iframe referrerPolicy="no-referrer" src="https://embed.moviecentral.xyz/movie/TMDBID"></iframe>`}
				</div>
			</div>
			<div className="flex flex-col p-4 bg-zinc-200">
				<div className="text-xl font-semibold">
					Episode Embed:{" "}
					<span className="font-semibold">https://embed.moviecentral.xyz/episode/TMDBID/SEASON/EPISODE</span>
				</div>
				<div className="font-semibold">
					<span className="font-normal">iframe code: </span>
					{`<iframe referrerPolicy="no-referrer" src="https://embed.moviecentral.xyz/episode/TMDBID/SEASON/EPISODE"></iframe>`}
				</div>
			</div>
		</div>
	);
}

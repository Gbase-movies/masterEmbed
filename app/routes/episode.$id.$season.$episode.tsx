import { json, LoaderFunctionArgs } from "@remix-run/node";
import { IMovieResult, MOVIES } from "@consumet/extensions";
import { useLoaderData } from "@remix-run/react";

interface LoaderData {
	embed: string;
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const { id, season, episode } = params as { id: string; season: string; episode: string };
	const flixhq = new MOVIES.FlixHQ();

	async function getMovieEmbed(id: string, season: string, episode: string) {
		const mediaInfo = await flixhq.fetchMediaInfo(id);

		if (!mediaInfo.episodes || mediaInfo.episodes.length === 0) {
			throw new Error("No episodes available for this movie");
		}
		const episodeInfo = mediaInfo.episodes.find(
			(ep) => ep.season === parseInt(season) && ep.number === parseInt(episode)
		);

		if (episodeInfo) {
			const movieId = episodeInfo?.id;
			const servers = await flixhq.fetchEpisodeServers(movieId, id);

			if (!servers || servers.length === 0) {
				throw new Error("No servers available for this episode");
			}

			const reqUrl = `https://flixhq.to/ajax/episode/sources/${servers[0].url.split(".")[2]}`;
			const response = await fetch(reqUrl);
			const sources = await response.json();

			return { embed: sources.link.replace("z=", "_debug=true") };
		} else {
			return { embed: "" };
		}
	}

	async function search(q: string) {
		return await flixhq.search(q);
	}

	const tmdbResponse = await fetch(
		`https://api.themoviedb.org/3/tv/${id}?api_key=a4b333e38a353f9746a776a9a8d36a62&language=en-US`
	);
	const tmdbData = await tmdbResponse.json();

	const searchResults = await search(tmdbData.name.replace("'", ""));

	for (const movie of searchResults.results) {
		const movieTitle = movie.title
			.toString()
			.toLowerCase()
			.replace(/\u00A0/g, " ")
			.trim();
		const tmdbTitle = tmdbData.name
			.toLowerCase()
			.replace(/\u00A0/g, " ")
			.trim();

		if (movieTitle === tmdbTitle) {
			const movieEmbed = await getMovieEmbed(movie.id, season, episode);
			return json<LoaderData>({ embed: movieEmbed.embed });
		}
	}

	throw new Error("Movie not found");
};

export default function Episode() {
	const { embed } = useLoaderData<LoaderData>();

	return (
		<iframe
			className="h-screen"
			referrerPolicy="no-referrer"
			src={embed}
			width="100%"
			height="100%"
			title="Movie Embed"
		></iframe>
	);
}

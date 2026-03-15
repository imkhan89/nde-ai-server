import { runSearchPipeline } from "./search_pipeline.js";
import { formatResults } from "./result_formatter.js";
import { logSearch } from "./search_logger.js";

/*
NDE Automotive AI
Pipeline Controller

Central controller for the full AI search flow
*/

export async function executeSearch(query) {

  if (!query) {
    return {
      query: "",
      results: []
    };
  }

  try {

    const pipelineResult = await runSearchPipeline(query);

    const formatted = formatResults(pipelineResult.results);

    logSearch(
      query,
      pipelineResult.parsed,
      formatted.length
    );

    return {
      query,
      parsed: pipelineResult.parsed,
      expandedTokens: pipelineResult.expandedTokens,
      intentScore: pipelineResult.intentScore,
      results: formatted
    };

  } catch (error) {

    console.error("Pipeline Controller Error:", error);

    return {
      query,
      results: []
    };

  }

}

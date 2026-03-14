import { AUTOMOTIVE_KNOWLEDGE_BASE } from "../data/automotive_knowledge_base.js";

export function generateKnowledgeResponse(productType) {

    if (!productType) return "";

    const key = productType.toLowerCase().replace(" ", "_");

    const knowledge = AUTOMOTIVE_KNOWLEDGE_BASE[key];

    if (!knowledge) return "";

    let response = "";

    if (knowledge.purpose) {

        response += `Information:\n`;
        response += `${knowledge.purpose}\n\n`;

    }

    if (knowledge.replacement_interval) {

        response += `Typical replacement interval:\n`;
        response += `${knowledge.replacement_interval}\n`;

    }

    return response;

}

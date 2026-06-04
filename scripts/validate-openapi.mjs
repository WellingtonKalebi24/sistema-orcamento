import SwaggerParser from "@apidevtools/swagger-parser";

const contractPath = "specs/001-sistema-orcamentos/contracts/openapi.yaml";

try {
  const contract = await SwaggerParser.validate(contractPath);
  const pathCount = Object.keys(contract.paths ?? {}).length;
  console.log(`Contrato OpenAPI valido: ${pathCount} caminhos em ${contractPath}.`);
} catch (error) {
  console.error(`Contrato OpenAPI invalido: ${error.message}`);
  process.exitCode = 1;
}

import { createServer, IncomingMessage, ServerResponse } from "http";
import validateVin from "./vin_validator";
import { generateVin } from "./generate_vin";

const PORT = 3000;

const requestHandler = (req: IncomingMessage, res: ServerResponse) => {
  const url = new URL(req.url || "", `http:/${req.headers.host}`);
  const pathname = url.pathname || "";
  const queryParams = Object.fromEntries(url.searchParams);

  res.setHeader("Content-type", "application/json");

  if (pathname.startsWith("/vin/validate") && req.method == "GET") {
    handleVinValidate(queryParams, res);
  } else if (pathname.startsWith("/vin/generate") && req.method == "GET") {
    handleGenerate(res);
  }
};

const server = createServer(requestHandler);

server.listen(PORT, () => {
  console.info("Server has been listening to localhost:" + PORT);
});

function handleGenerate(res: ServerResponse<IncomingMessage>) {
  let response: ApiResponse<string>;
  const vinResult = generateVin();
  if (vinResult.isSuccess()) {
    res.writeHead(200);
    response = {
      status: "success",
      data: vinResult.getValue(),
    };
  } else {
    res.writeHead(500);
    response = {
      status: "success",
      message: vinResult.getError(),
    };
  }
  res.end(safeStringify(response));
}

function handleVinValidate(
  queryParams: { [k: string]: string },
  res: ServerResponse<IncomingMessage>
) {
  const vin = queryParams["vin"] || "";
  let isSuccess = false;
  let validation: VinValidation;
  const vinValidator = validateVin(vin);

  if (vinValidator.isSuccess()) {
    isSuccess = true;
    validation = {
      vin: vinValidator.getValue(),
      isValid: true,
    };
  } else {
    isSuccess = false;
    validation = {
      vin: vin,
      isValid: false,
      error: vinValidator.getError(),
    };
  }
  const response: ApiResponse<VinValidation> = {
    status: isSuccess ? "success" : "error",
    data: validation,
    message: validation.error,
  };
  res.writeHead(isSuccess ? 200 : 500);
  res.end(safeStringify(response));
}

interface ApiResponse<T> {
  status: "success" | "error";
  message?: string;
  data?: T;
}

interface VinValidation {
  vin: string;
  error?: string;
  isValid: boolean;
}

function safeStringify<T>(obj: T): string {
  try {
    return JSON.stringify(obj);
  } catch (error) {
    console.error(error);
    return "{}";
  }
}

import { Nothing } from "purify-ts/Maybe";
import { MaybeAsync } from "purify-ts/MaybeAsync";

export const fromContext = jest.fn().mockReturnValue(MaybeAsync.liftMaybe(Nothing));

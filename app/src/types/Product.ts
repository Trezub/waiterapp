import { RouterOutput } from "../utils/trpc";

type Product = RouterOutput["product"]["getAll"][number];

export default Product;

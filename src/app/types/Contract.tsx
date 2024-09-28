import { Contract as ModelContract } from "../models/Contract"

function Contract(props: { contract: ModelContract }) {
    return (<>
        <h3>{props.contract.id}: {props.contract.title}</h3>
    </>  );
}

export default Contract;
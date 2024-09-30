import { Contract as ContractType } from "@/app/schemas/Contract";

function Contract(props: { contract: ContractType }) {
    return (<>
        <h3>{props.contract._id}: {props.contract.title}</h3>
    </>  );
}

export default Contract;
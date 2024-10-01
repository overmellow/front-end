import { Contract as ContractType } from "@/app/schemas/Contract";

function Contract(props: { contract: ContractType }) {
    return (<>
        <p className='mb-0'>{props.contract._id}: {props.contract.title}</p>
    </>  );
}

export default Contract;
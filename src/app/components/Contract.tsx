import { ContractI } from "../interfaces/ContractI";

function Contract(props: { contract: ContractI }) {
    return (<>
        <p className='mb-0'>{props.contract._id?.toString()}: {props.contract.title}</p>
    </>  );
}

export default Contract;
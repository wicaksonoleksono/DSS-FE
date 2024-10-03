import axios from "axios";
import { base_url } from "./config";

console.log(base_url)
type Matrix = number[][];
type Wp = {
    criteria_weights: number[];
    decision_matrix: Matrix;
    criteria_types: string[];
};

const endpoint = {
    calculate: "/saw/calculate",
    get: "/saw/results"
};

const calculateSaw = async ({ criteria_weights, decision_matrix, criteria_types }: Wp) => {
    try {
        const response = await axios.post(
            `${base_url}${endpoint.calculate}`,
            { criteria_weights, decision_matrix, criteria_types } 
        );
        console.log("Calculation result:", response.data);
        return response.data; 
    } catch (error) {
        console.error("Error calculating SAW:", error);
    }
};

const getSaw = async () => {
    try {
        const response = await axios.get(
            `${base_url}${endpoint.get}`
        );
        console.log("Get SAW result:", response.data);
        return response.data; 
    } catch (err) {
        console.error(`Error fetching SAW result: ${err}`);
    }
};

export { calculateSaw, getSaw };

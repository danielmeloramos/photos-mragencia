import axios from "axios";
import { cloudflareImageResponse } from "types";

async function getFolders() {
    return await axios.get(`https://folder-photos-mragencia.meloramosdaniel.workers.dev`);
}

async function getLastFolderAlteration(folderName: string) {
    return await axios.get(`https://folder-last-update-photos-mragencia.meloramosdaniel.workers.dev?prefix=${folderName}`);
}

async function getAllImagesByFolder(folderName: string, cursor: string = '') {
    return await axios.get<cloudflareImageResponse>(`https://photos-mragencia.meloramosdaniel.workers.dev?prefix=${folderName}/&limit=40&cursor=${cursor}`);
}

const cloudflareApi = { getFolders, getLastFolderAlteration, getAllImagesByFolder };

export default cloudflareApi;

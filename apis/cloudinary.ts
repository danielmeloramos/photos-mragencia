import cloudinary from "utils/cloudinary"

async function getFolders() {
    const LIMIT = 5;
    let result = await cloudinary.v2.api.root_folders();
    result.folders = result.folders.slice(0, LIMIT);
    return result;
}

async function getLastFolderAlteration(folderName: string) {
    const resources = await cloudinary.v2.api.resources_by_asset_folder(folderName, {
        type: 'upload',
        max_results: 1,
        order_by: 'created_at',
        direction: 'desc',
    });

    return resources.resources[0]?.created_at ?? null;
}

async function getAllImagesByFolder(folderName: string) {
    return await cloudinary.v2.api.resources_by_asset_folder(folderName, {
        type: 'upload',
        max_results: 2000,
        resource_type: 'image',
    });
}

async function getAllResults(cursor: string | null = null) {
    const results = await cloudinary.v2.search
        .sort_by('created_at', 'desc')
        .max_results(2000)
        .next_cursor(cursor)
        .execute()

    if (results.next_cursor) {
        return getAllResults(results.next_cursor)
    }

    return results;
}

const cloudinaryApi = { getAllResults, getFolders, getLastFolderAlteration, getAllImagesByFolder };

export default cloudinaryApi;

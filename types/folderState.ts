import { folder } from "./folder";

type folderState = {
    folder: folder | null;
    add: (folder: folder) => void;
}

export type { folderState }

// Load Service for generating ULID (Universally Unique Lexicographically Sortable Identifier).
import { ulid } from "ulidx";

/**
 * UlidService
 *
 * Service for generating ULID (Universally Unique Lexicographically Sortable Identifier).
 */
class UlidService {
  getUlidId() {
    return ulid();
  }
}

export default new UlidService();

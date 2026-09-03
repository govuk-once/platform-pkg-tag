import { GovUKTag } from '../gov-uk-tag.class';

export const DATA_CLASSIFICATION_TAG = 'DataClassification';

export enum DATA_CLASSIFICATION_CONTROL_VALUES {
  OFFICIAL = 'OFFICIAL',
  OFFICIAL_SENSITIVE = 'OFFICIAL_SENSITIVE',
  SENSITIVE = 'SENSITIVE',
  TOP_SECRET = 'TOP_SECRET',
}

/** DataClassificationTag
 *
 * Describes the sensitivity of data handled by the resource.
 *
 * "The Government Security Classifications Policy (GSCP) provides an administrative system for HM Government (HMG) and our partners to protect information assets appropriately against prevalent threats.
 * The administrative system uses three classification tiers (OFFICIAL, SECRET and TOP SECRET) that each provide a set of protective security controls and baseline behaviours, which are proportionate to the potential impact of a compromise, accidental loss or incorrect disclosure AND the level of interest expected from threat actors. The protective controls must be balanced with the need for utilising those assets to support the effective conduct of government business.
 * Any information that is created, processed or moved (sent and received) as a part of your work for HMG falls within the GSCP."
 * @see {@link https://www.gov.uk/government/publications/government-security-classifications/government-security-classifications-policy-html Government Security Classifications Policy}
 */
export class DataClassificationTag {
  constructor(private readonly parent: GovUKTag) {}

  /** OFFICIAL Security Data Classification
   *
   * @note must trigger a review
   * @see {@link https://www.gov.uk/government/publications/government-security-classifications/government-security-classifications-policy-html#definitions-for-official-secret-and-top-secret Government Security Classifications Policy - Definitions for official secret and top secret}
   * @example TODO provide example
   */
  OFFICIAL(): GovUKTag {
    return this.parent.add(
      DATA_CLASSIFICATION_TAG,
      DATA_CLASSIFICATION_CONTROL_VALUES.OFFICIAL,
    );
  }

  /** OFFICIAL SENSITIVE Security Data Classification
   *
   * @see {@link https://www.gov.uk/government/publications/government-security-classifications/government-security-classifications-policy-html#definitions-for-official-secret-and-top-secret Government Security Classifications Policy - Definitions for official secret and top secret}
   * @see {@link https://www.gov.uk/government/publications/government-security-classifications/government-security-classifications-policy-html#additional-markings Government Security Classifications Policy - Additional Markings}
   * @example TODO provide example
   */
  OFFICIAL_SENSITIVE(): GovUKTag {
    return this.parent.add(
      DATA_CLASSIFICATION_TAG,
      DATA_CLASSIFICATION_CONTROL_VALUES.OFFICIAL_SENSITIVE,
    );
  }

  /** SENSITIVE Security Data Classification
   *
   * @see {@link https://www.gov.uk/government/publications/government-security-classifications/government-security-classifications-policy-html#definitions-for-official-secret-and-top-secret Government Security Classifications Policy - Definitions for official secret and top secret}
   * @see {@link https://www.gov.uk/government/publications/government-security-classifications/government-security-classifications-policy-html#additional-markings Government Security Classifications Policy - Additional Markings}
   * @example TODO provide example
   */
  SENSITIVE(): GovUKTag {
    return this.parent.add(
      DATA_CLASSIFICATION_TAG,
      DATA_CLASSIFICATION_CONTROL_VALUES.SENSITIVE,
    );
  }

  /** TOP_SECRET Security Data Classification
   *
   * @see {@link https://www.gov.uk/government/publications/government-security-classifications/government-security-classifications-policy-html#definitions-for-official-secret-and-top-secret Government Security Classifications Policy - Definitions for official secret and top secret}
   * @example TODO provide example
   */
  TOP_SECRET(): GovUKTag {
    return this.parent.add(
      DATA_CLASSIFICATION_TAG,
      DATA_CLASSIFICATION_CONTROL_VALUES.TOP_SECRET,
    );
  }
}

import { Stack, Tags, Aspects, AspectPriority } from 'aws-cdk-lib';
import { IRole } from 'aws-cdk-lib/aws-iam';

import {
  ExposureTag,
  DataClassificationTag,
  PIITag,
  UtilTag,
  OnceTag,
} from './tag';
import { GovUKTagApplyAspect } from './gov-uk-tag-apply.aspect';
import { GovUKTagValidateAspect } from './gov-uk-tag-validate.aspect';

import type { IConstruct } from 'constructs';
import type { GovUKTagAspectProps } from './gov-uk-tag.types';
// extra custom tags
export class GovUKTag {
  private constructor(private readonly scope: IConstruct) {}

  static of(scope: IConstruct | IRole): GovUKTag {
    return new GovUKTag(scope);
  }

  /** {@link DataClassificationTag DataClassification Tag}
   *
   * Describes the sensitivity of data handled by the resource.
   *
   * "The Government Security Classifications Policy (GSCP) provides an administrative system for HM Government (HMG) and our partners to protect information assets appropriately against prevalent threats.
   * The administrative system uses three classification tiers (OFFICIAL, SECRET and TOP SECRET) that each provide a set of protective security controls and baseline behaviours, which are proportionate to the potential impact of a compromise, accidental loss or incorrect disclosure AND the level of interest expected from threat actors. The protective controls must be balanced with the need for utilising those assets to support the effective conduct of government business.
   * Any information that is created, processed or moved (sent and received) as a part of your work for HMG falls within the GSCP."
   * @see {@link https://www.gov.uk/government/publications/government-security-classifications/government-security-classifications-policy-html Government Security Classifications Policy}
   */
  get DataClassification(): DataClassificationTag {
    return new DataClassificationTag(this);
  }

  /** Describes whether the resource is public, private, internal, or otherwise exposed. */
  get Exposure(): ExposureTag {
    return new ExposureTag(this);
  }

  /** Describes whether the resource holds personal identifiable data. */
  get PII(): PIITag {
    return new PIITag(this);
  }

  /** Util TODO add comment */
  get Util(): UtilTag {
    return new UtilTag(this);
  }

  /** Core Once tag suggestions and util. */
  static get Once(): OnceTag {
    return new OnceTag(this);
  }

  /**
   * Register the GOV.UK tagging aspects on an app or stack.
   *
   * Two passes at different priorities: the apply pass writes the app-wide
   * tags, the validate pass reads back the resource-level compliance tags.
   * Both must be registered, and in this order of priority — a validate pass
   * that runs before tags are written reports missing tags on a compliant
   * stack.
   *
   * @param scope - App or stack to tag. Everything beneath it is visited.
   * @param props - App tag values and behaviour flags.
   * @throws Error if any supplied tag value is empty, padded, too short, or
   * a recognised placeholder.
   */
  static applyAspect(scope: IConstruct, props: GovUKTagAspectProps): void {
    if (props.disabled) return;

    Aspects.of(scope).add(new GovUKTagApplyAspect(props), {
      priority: AspectPriority.MUTATING, // 200
    });

    Aspects.of(scope).add(new GovUKTagValidateAspect(props), {
      priority: AspectPriority.READONLY, // 1000, runs after MUTATING
    });
  }

  /**
   * Tag a construct that has no handle in scope, by path suffix.
   *
   * Only needed for resources CDK creates internally — notification handlers,
   * custom resource providers, log retention singletons. For anything you
   * construct yourself, `GovUKTag.of(parent)` already propagates to every
   * child and is preferable: it survives renames and CDK version bumps,
   * whereas a path string does not.
   *
   * @param root - Construct to search beneath, usually `Stack.of(this)`.
   * @param path - Trailing portion of the construct path, e.g.
   * `'BucketNotificationsHandler'` or `'ConfigurationRole/Resource'`.
   * @throws Error if the suffix matches no construct, or more than one — a
   * silent miss would leave a compliance tag unapplied while appearing to work.
   */
  static buriedOf(scope: IConstruct, path: string): GovUKTag {
    const root = Stack.of(scope);
    const found = root.node
      .findAll()
      .filter((construct) => construct.node.path.includes(path));

    // Descendants of another match are covered by tagging their ancestor —
    // Tags.of() propagates down the subtree — so keep only the roots.
    const matches = found.filter(
      (candidate) =>
        !found.some(
          (other) =>
            other !== candidate &&
            candidate.node.path.startsWith(`${other.node.path}/`),
        ),
    );

    if (matches.length === 0) {
      throw new Error(
        `No construct in stack '${root.stackName}' matches '${path}'`,
      );
    }

    if (matches.length > 1) {
      throw new Error(
        `Ambiguous path '${path}' in stack '${root.stackName}': ` +
          matches.map((c) => c.node.path).join(', '),
      );
    }

    return GovUKTag.of(matches[0]);
  }

  /** Internal — applies the tag and returns this for chaining. */
  add(key: string, value: string): GovUKTag {
    Tags.of(this.scope).add(key, value);
    return this;
  }
}

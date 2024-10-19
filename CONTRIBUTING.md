# CONTRIBUTING

## HOW TO INSTALL

```
poetry install
```

## HOW TO RUN TESTS

```
pytest -m "not benchmark and not merkletreejs"
```

## WORKFLOW

1. Create your **proposal/bug** in an _issue_.
2. Create a new **branch** and **pull request** with the pattern:
   - `feat/my-new-feature`.
   - `docs/add-new-docs`.
   - `test/add-a-test`.
   - `fix/big-bug`.
3. Open a PR for you _issue_ (or link with a existent)
4. Await to `merge`
5. Publish new change by `tag`

<img width="1172" alt="Gitlab Flow" src="https://user-images.githubusercontent.com/50037567/165442258-072abfe6-2295-40d6-a573-92f851878c4c.png">

---

## CONVENTIONAL COMMIT

```
type(escope): short description

You need describe better?
Write more here
```

type

- **add** adds a new feature
- **fix** fixes a bug
- **update** does not add a feature or fix a bug
- **remove** remove a peace of code
- **security** update/fix some security matter code

---

## SEMANTIC VERSION

Major.Minor.Patch (e.g. 1.3.4)

- **deprecated!** -> _Major_
- **add** -> _Minor_
- **update | fix** -> _Patch_

---

## READTHEDOCS

- [Development Inside a Container](https://code.visualstudio.com/docs/remote/containers#_getting-started)
- [Trunk Base Development](https://trunkbaseddevelopment.com)
- [Trunk Base Development](https://trunkbaseddevelopment.com)
- [Good Practices](https://bestpractices.coreinfrastructure.org/pt-BR)
- [Semantic Versioning](https://semver.org/lang/pt-BR/)
- [More about Versioning](http://www.modelcvs.org/versioning/)
- [Versioning Automate](https://bhuwanupadhyay.github.io/2020/04/applying-semantic-versioning-with-git-repository/)
- [Conventional Commit](https://www.conventionalcommits.org/en/v1.0.0-beta.2/#why-use-conventional-commits)
- [Default Angular Commit](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines)
- [Global hook for repositories](https://docs.gitlab.com/ce/administration/server_hooks.html#set-a-global-server-hook-for-all-repositories)
- [More about Commits](https://chris.beams.io/posts/git-commit/)
- [Quick Actions for Commits](https://docs.gitlab.com/ee/user/project/quick_actions.html)
- [Commits examples](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#)
- [Full Tutorial Add Convetional Commit as default](https://prahladyeri.com/blog/2019/06/how-to-enforce-conventional-commit-messages-using-git-hooks.html)
- [Create a global git commit hook](https://coderwall.com/p/jp7d5q/create-a-global-git-commit-hook)

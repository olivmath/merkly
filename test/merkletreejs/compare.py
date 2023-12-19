import hashlib


def hash_function(data):
    return hashlib.sha256(data).digest()


def merkle_tree_root(leaves):
    # Converte as folhas para hashed leaves se necessário
    hashed_leaves = [hash_function(leaf.encode()) for leaf in leaves]

    # Constrói as camadas da árvore
    while len(hashed_leaves) > 1:
        # Se o número de nós for ímpar, duplica o último nó
        if len(hashed_leaves) % 2 == 1:
            hashed_leaves.append(hashed_leaves[-1])

        # Combina cada par de nós consecutivos
        hashed_leaves = [
            hash_function(hashed_leaves[i] + hashed_leaves[i + 1])
            for i in range(0, len(hashed_leaves), 2)
        ]

    # Retorna a raiz da Merkle
    return hashed_leaves[0]


# Exemplo de uso
leaves = ["a", "b", "c", "d", "e", "f", "g"]
root = merkle_tree_root(leaves)
print(root.hex())  # Retorna a raiz da Merkle em formato hexadecimal

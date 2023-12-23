import hashlib

def hash_function(data):
    return hashlib.sha256(data.encode()).hexdigest()

def merkle_tree_root(leaves):
    # Converte as folhas para hashed leaves se necessário
    hashed_leaves = [hash_function(leaf) for leaf in leaves]
    
    # Constrói as camadas da árvore
    while len(hashed_leaves) > 1:
        # Se o número de nós for ímpar, duplica o último nó
        if len(hashed_leaves) % 2 == 1:
            hashed_leaves.append(hashed_leaves[-1])
        
        # Combina cada par de nós consecutivos
        hashed_leaves = [hash_function(hashed_leaves[i] + hashed_leaves[i + 1]) for i in range(0, len(hashed_leaves), 2)]
    
    # Retorna a raiz da Merkle
    return hashed_leaves[0]

# Alterando as folhas para ['a', 'b', 'c', 'd'] e recalculando a raiz da Merkle
leaves = ["a", "b", "c", "d"]
root = merkle_tree_root(leaves)
root.hex()  # Retorna a raiz da Merkle em formato hexadecimal

